import subprocess as sp

command = """\
	sshpass -p "Masterplayout" ssh root@192.168.5.32 \
	'qcb attach;\
	send \x03;
	send \x03;
	pwd;\
	exit'\
	"""

print(sp.getstatusoutput(command))
